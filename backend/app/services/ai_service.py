import os
import re
import random
import json
import numpy as np
import pickle
from pathlib import Path
try:
    import google.generativeai as genai
except ImportError:
    pass

# AI Models (Lazy-loaded to prevent massive memory usage on app initialization/import)
_hf_sentiment_pipeline = None
_sentence_model = None

# Crisis Keywords for immediate heuristic fallback
CRISIS_KEYWORDS = [
    r'\bsuicide\b', r'\bkill myself\b', r'\bwant to die\b', r'\bself harm\b',
    r'\bend it all\b', r'\bharm myself\b', r'\bno point in living\b'
]

def _get_sentiment_pipeline():
    # Disabled heavy local NLP for maximum speed. Relying on API & heuristics.
    return None

def _get_embedding_model():
    # Disabled heavy local NLP for maximum speed.
    return None

class MemoryFAISS:
    def __init__(self, user_id):
        self.user_id = user_id
        self.store_dir = Path("vector_stores")
        self.store_dir.mkdir(exist_ok=True)
        self.index_path = self.store_dir / f"user_{user_id}.index"
        self.meta_path = self.store_dir / f"user_{user_id}_meta.pkl"

        self.dimension = 384
        self.texts = []

        try:
            import faiss
            self.faiss_available = True

            if self.index_path.exists() and self.meta_path.exists():
                self.index = faiss.read_index(str(self.index_path))
                with open(self.meta_path, "rb") as f:
                    self.texts = pickle.load(f)
            else:
                self.index = faiss.IndexFlatL2(self.dimension)
        except Exception as e:
            print("FAISS Init Error:", e)
            self.faiss_available = False

    def add_interaction(self, user_msg, ai_reply):
        if not self.faiss_available: return
        try:
            model = _get_embedding_model()
            if not model: return
            text = f"User: {user_msg}\nAI: {ai_reply}"
            embedding = model.encode([text])[0]
            self.index.add(np.array([embedding], dtype=np.float32))
            self.texts.append(text)
            self.save()
        except:
            pass

    def save(self):
        import faiss
        faiss.write_index(self.index, str(self.index_path))
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.texts, f)

    def retrieve(self, query, top_k=3):
        if not self.faiss_available or self.index.ntotal == 0:
            return []
        try:
            model = _get_embedding_model()
            if not model: return []
            query_embedding = model.encode([query])[0]
            D, I = self.index.search(np.array([query_embedding], dtype=np.float32), min(top_k, len(self.texts)))
            results = [self.texts[i] for i in I[0] if i != -1]
            return results
        except:
            return []


def detect_crisis(user_message: str) -> bool:
    """Rule-based crisis detection."""
    message_lower = user_message.lower()
    for pattern in CRISIS_KEYWORDS:
        if re.search(pattern, message_lower):
            return True
    return False


def analyze_sentiment(text: str) -> tuple:
    """
    Returns: (str: 'positive'|'neutral'|'negative', float: -1.0 to 1.0)
    """
    if not text:
        return 'neutral', 0.0

    pipeline = _get_sentiment_pipeline()
    if pipeline:
        try:
            result = pipeline(text[:512])[0]
            label = result['label'].lower()
            score = result['score'] if label == 'positive' else -result['score']
            if -0.3 <= score <= 0.3:
                return 'neutral', score
            return label, score
        except Exception as e:
            print("HF Sentiment Error:", e)

    return 'neutral', 0.0


def detect_emotions(user_message: str) -> list:
    """Heuristic keyword detection for specific emotions."""
    msg_lower = user_message.lower()
    detected = []

    emotion_keywords = {
        'anxiety':    ['anxious', 'worried', 'worry', 'nervous', 'panic'],
        'sadness':    ['sad', 'depressed', 'depressing', 'down', 'unhappy'],
        'anger':      ['angry', 'frustrated', 'annoyed', 'irritated'],
        'stress':     ['stressed', 'stress', 'pressure', 'overwhelmed'],
        'joy':        ['happy', 'joyful', 'excited', 'delighted'],
        'fear':       ['afraid', 'scared', 'fear', 'terrified'],
        'loneliness': ['lonely', 'alone', 'isolated']
    }

    for emotion, keywords in emotion_keywords.items():
        if any(keyword in msg_lower for keyword in keywords):
            detected.append(emotion)

    return detected


def _get_gemini_model():
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key or api_key == "YOUR_GEMINI_API_KEY":
        return None
    try:
        genai.configure(api_key=api_key)
        return genai.GenerativeModel('gemini-1.5-pro')
    except Exception as e:
        print("Gemini Config Error:", e)
        return None


def get_ai_response(user_message: str, history_context: list = None, user_id=None) -> str:
    """
    Multi-layered AI Engine: Gemini → Rule-based fallback.
    Handles general queries, mental health support, and crisis detection.
    """
    if history_context is None:
        history_context = []

    model = _get_gemini_model()

    # 1. SEMANTIC CONTEXT RETRIEVAL (FAISS)
    semantic_history = ""
    faiss_mem = None
    if user_id:
        faiss_mem = MemoryFAISS(user_id)
        relevant_past_exchanges = faiss_mem.retrieve(user_message, top_k=2)
        if relevant_past_exchanges:
            semantic_history = "Relevant moments from past conversations:\n" + "\n".join(relevant_past_exchanges)

    # 2. GEMINI PATH
    if model:
        system_prompt = f"""
You are Melth AI — a warm, intelligent assistant embedded in a Mental Health Support Portal.
You handle BOTH general conversations AND mental health support.

## GENERAL QUERY HANDLING
For any non-mental-health question (factual, coding, math, creative writing, general advice, trivia, etc.):
- Answer helpfully and accurately, like a knowledgeable friend
- Keep the reply concise and conversational
- Set mood to "neutral", action to "none"

## MENTAL HEALTH SUPPORT
For emotional / mental health messages:
- Be empathetic, calm, and non-judgmental
- Classify mood as: happy | neutral | stressed | anxious | depressed | crisis
- Suggest exercises or coping strategies as appropriate

## CRISIS DETECTION (HIGHEST PRIORITY)
If the user says anything like: "suicide", "kill myself", "end it", "want to die", "self harm", "no point in living" —
- IMMEDIATELY set mood to "crisis" and action to "emergency_call"
- Show strong empathy and provide local helplines (default: 988, 911, 9152987821)
- DO NOT provide website links — only direct call numbers

## TONE
- Warm, human, intelligent
- Never robotic or clinical for casual messages
- Never encourage harm; always prioritize safety

## CONTEXT MEMORY
{semantic_history}

## OUTPUT FORMAT
Return ONLY valid JSON — no markdown, no code fences, no extra text.
{{
    "reply": "<your response>",
    "mood": "<happy|neutral|stressed|anxious|depressed|crisis>",
    "confidence": <0.0-1.0>,
    "action": "<none|suggest_exercise|emergency_call>",
    "resources": {{
        "videos": [],
        "tips": []
    }},
    "exercise": "<actionable task or empty string>",
    "emergency": [],
    "community_prompt": "<optional encouragement to share in community, or empty>"
}}
"""

        gemini_messages = [
            {"role": "user",  "parts": [system_prompt]},
            {"role": "model", "parts": ['{"reply": "Understood. I will handle all queries and always return valid JSON.", "mood": "neutral", "confidence": 1.0, "action": "none", "resources": {"videos": [], "tips": []}, "exercise": "", "emergency": [], "community_prompt": ""}']},
        ]

        for msg in history_context[-6:]:
            role = "user" if msg['role'] == 'user' else "model"
            gemini_messages.append({"role": role, "parts": [msg['content']]})

        gemini_messages.append({"role": "user", "parts": [user_message]})

        try:
            generation_config = genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
            response = model.generate_content(gemini_messages, generation_config=generation_config)
            reply_text = response.text.strip()

            # Strip accidental markdown fences
            if reply_text.startswith("```json"):
                reply_text = reply_text[7:].rstrip("` \n")
            elif reply_text.startswith("```"):
                reply_text = reply_text[3:].rstrip("` \n")

            json.loads(reply_text)  # Validate

            if faiss_mem:
                faiss_mem.add_interaction(user_message, reply_text)

            return reply_text

        except Exception as e:
            print(f"Gemini API Error: {e}")
            # Fall through to rule-based fallback

    # 3. RULE-BASED FALLBACK
    fallback_reply = _generate_fallback_response(user_message)
    if faiss_mem:
        faiss_mem.add_interaction(user_message, fallback_reply)
    return fallback_reply


# ---------------------------------------------------------------------------
# Fallback response engine — handles general + mental health queries offline
# ---------------------------------------------------------------------------

def _build_response(**kwargs) -> str:
    """Build a JSON response string with sensible defaults."""
    base = {
        "reply": "",
        "mood": "neutral",
        "confidence": 0.6,
        "action": "none",
        "resources": {"videos": [], "tips": []},
        "exercise": "",
        "emergency": [],
        "community_prompt": ""
    }
    base.update(kwargs)
    return json.dumps(base)


def _generate_fallback_response(user_message: str) -> str:
    msg = user_message.strip()
    msg_lower = msg.lower()

    # ── 1. Crisis (highest priority) ─────────────────────────────────────────
    crisis_words = ["suicide", "kill myself", "end it", "want to die", "self harm",
                    "harm myself", "no point in living"]
    if any(w in msg_lower for w in crisis_words):
        return _build_response(
            reply="I'm so sorry you're carrying this much pain right now. Your life matters deeply. Please reach out for immediate support — you don't have to face this alone.",
            mood="crisis",
            confidence=0.99,
            action="emergency_call",
            emergency=["988", "911", "9152987821"]
        )

    # ── 2. Greetings ──────────────────────────────────────────────────────────
    greetings = {"hi", "hello", "hey", "sup", "yo", "howdy",
                 "good morning", "good afternoon", "good evening", "good night", "hi there"}
    if msg_lower in greetings or msg_lower.rstrip("!") in greetings:
        return _build_response(
            reply="Hey there! 👋 I'm Melth AI — your mental health companion and general assistant. How can I help you today?"
        )

    # ── 3. "How are you" type questions ───────────────────────────────────────
    if re.search(r"\bhow are you\b|\bhow('s| is) it going\b|\bwhat's up\b|\bwassup\b", msg_lower):
        return _build_response(
            reply="I'm doing great, thanks for asking! I'm here and ready to help. What's on your mind?"
        )

    # ── 4. Identity / capability questions ────────────────────────────────────
    if re.search(r"\bwho are you\b|\bwhat are you\b|\bwhat can you do\b|\bwhat('s| is) your name\b", msg_lower):
        return _build_response(
            reply=(
                "I'm Melth AI — an intelligent assistant built into this Mental Health Support Portal. "
                "I can chat about anything: answer questions, help with mental health, suggest exercises, "
                "or just be someone to talk to. What would you like to explore?"
            )
        )

    # ── 5. Thank you ──────────────────────────────────────────────────────────
    if re.search(r"\bthank(s| you)\b|\bthx\b|\bty\b", msg_lower):
        return _build_response(
            reply="You're very welcome! 😊 I'm always here if you need anything else."
        )

    # ── 6. Farewell ───────────────────────────────────────────────────────────
    if re.search(r"\bbye\b|\bgoodbye\b|\bsee you\b|\btake care\b|\bgotta go\b", msg_lower):
        return _build_response(
            reply="Take care! Remember, I'm here whenever you need support or just want to chat. 💙"
        )

    # ── 7. Math ───────────────────────────────────────────────────────────────
    math_match = re.match(r"^what(?:'s| is)?\s+([\d\s\+\-\*\/\(\)\.]+)\??$", msg_lower)
    if math_match:
        expr = math_match.group(1).strip()
        try:
            result = eval(expr, {"__builtins__": {}})  # safe-ish for simple arithmetic
            return _build_response(reply=f"The answer is **{result}**.")
        except:
            pass

    # Direct arithmetic like "2 + 2" or "100 / 4"
    arith_match = re.match(r"^([\d\s\+\-\*\/\(\)\.]+)$", msg.strip())
    if arith_match:
        try:
            result = eval(arith_match.group(1).strip(), {"__builtins__": {}})
            return _build_response(reply=f"That equals **{result}**.")
        except:
            pass

    # ── 8. Time / date questions ──────────────────────────────────────────────
    if re.search(r"\b(what('s| is) the (time|date|day)|what day is it|current time)\b", msg_lower):
        return _build_response(
            reply="I don't have access to a real-time clock right now. You can check the time on your device!"
        )

    # ── 9. Weather ────────────────────────────────────────────────────────────
    if re.search(r"\bweather\b|\btemperature\b|\brain\b|\bforecast\b", msg_lower):
        return _build_response(
            reply="I don't have live weather data, but you can check a weather app or search online for your local forecast!"
        )

    # ── 10. Jokes ─────────────────────────────────────────────────────────────
    if re.search(r"\btell me a joke\b|\bfunny\b|\bmake me laugh\b|\bjoke\b", msg_lower):
        jokes = [
            "Why don't scientists trust atoms? Because they make up everything! 😄",
            "I told my doctor I broke my arm in two places. He told me to stop going to those places. 😆",
            "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
            "What do you call a fish with no eyes? A fsh! 🐟"
        ]
        return _build_response(reply=random.choice(jokes), mood="happy")

    # ── 11. Motivational quote ────────────────────────────────────────────────
    if re.search(r"\bmotivat\b|\binspir\b|\bquote\b|\bencourage\b", msg_lower):
        quotes = [
            '"You don\'t have to be great to start, but you have to start to be great." — Zig Ziglar',
            '"The only way out is through." — Robert Frost',
            '"Progress, not perfection." — Unknown',
            '"Even the darkest night will end and the sun will rise." — Victor Hugo'
        ]
        return _build_response(reply=random.choice(quotes), mood="happy")

    # ── 12. Mental health — Anxiety ───────────────────────────────────────────
    if any(w in msg_lower for w in ["anxious", "panic", "panicking", "anxiety", "nervous", "worried", "worry"]):
        return _build_response(
            reply="I can hear how stressed you're feeling right now. Let's ground you gently — you're safe in this moment.",
            mood="anxious",
            action="suggest_exercise",
            exercise="Try box breathing: Inhale slowly for 4 seconds → Hold for 4 → Exhale for 4 → Hold for 4. Repeat 4 times. This activates your parasympathetic nervous system.",
            resources={
                "videos": ["4-7-8 Breathing Technique - YouTube"],
                "tips": ["Label your anxiety: say 'I notice I'm feeling anxious' — this creates distance from the feeling.",
                         "Your body's alarm system is working overtime. That's okay. It will settle."]
            }
        )

    # ── 13. Mental health — Stress / overwhelm ────────────────────────────────
    if any(w in msg_lower for w in ["stressed", "stress", "overwhelmed", "burnt out", "burnout", "too much"]):
        return _build_response(
            reply="It sounds like you have a lot on your plate. Feeling overwhelmed is your mind's way of asking for a pause.",
            mood="stressed",
            action="suggest_exercise",
            exercise="Write down every task swirling in your head — all of them. Then circle just ONE you can do in the next 15 minutes. The rest can wait.",
            resources={
                "tips": ["Break tasks into tiny steps — the next action, not the whole project.",
                         "A 5-minute walk outside can measurably lower cortisol levels."]
            }
        )

    # ── 14. Mental health — Sadness / depression ──────────────────────────────
    if any(w in msg_lower for w in ["sad", "depressed", "depression", "down", "unhappy", "hopeless", "empty", "numb", "crying", "cry"]):
        return _build_response(
            reply="I'm really glad you're talking about this. Feeling this way is hard, and your feelings are completely valid.",
            mood="depressed",
            action="suggest_exercise",
            exercise="Try a 'comfort list': write 3 small things that have brought you even a tiny bit of comfort before — a song, a smell, a place. Then experience one of them today.",
            resources={
                "tips": ["You don't have to feel better right now. Just being here is enough.",
                         "Consider reaching out to one trusted person today, even just to say hello."]
            }
        )

    # ── 15. Mental health — Anger / frustration ───────────────────────────────
    if any(w in msg_lower for w in ["angry", "anger", "furious", "rage", "frustrated", "frustration", "annoyed", "irritated"]):
        return _build_response(
            reply="Your frustration makes complete sense. Anger often points to something important — a boundary crossed or a need unmet.",
            mood="stressed",
            action="suggest_exercise",
            exercise="Try a 'pressure release': clench your fists as tight as you can for 5 seconds, then slowly release. Breathe out as you do. Repeat 3 times.",
            resources={
                "tips": ["Ask yourself: what is this anger protecting? Often it's a softer feeling underneath.",
                         "It's okay to step away from a situation before responding."]
            }
        )

    # ── 16. Mental health — Loneliness ───────────────────────────────────────
    if any(w in msg_lower for w in ["lonely", "alone", "isolated", "no friends", "no one cares"]):
        return _build_response(
            reply="Feeling lonely can be one of the most painful experiences. I want you to know — I'm here, and you're not invisible.",
            mood="depressed",
            action="suggest_exercise",
            exercise="Write a short letter to your future self about how you're feeling today. No rules — just honest words.",
            community_prompt="Consider sharing in the community space — others here know exactly how this feels."
        )

    # ── 17. Cognitive distortions ────────────────────────────────────────────
    if any(w in msg_lower for w in ["always", "never", "ruined", "everything is", "nothing ever", "worst"]):
        return _build_response(
            reply="It sounds like your mind might be in 'all-or-nothing' mode right now — that's a very common cognitive pattern when we're under pressure.",
            mood="stressed",
            action="suggest_exercise",
            exercise="Challenge the thought: Is this 100% true all of the time? Can you think of even one small exception? Write it down.",
            resources={
                "tips": ["Our brains overgeneralize when stressed. Naming the pattern helps defuse it."]
            }
        )

    # ── 18. Sleep problems ───────────────────────────────────────────────────
    if any(w in msg_lower for w in ["can't sleep", "insomnia", "sleep", "tired", "exhausted", "fatigue"]):
        return _build_response(
            reply="Poor sleep can really affect how we feel emotionally and mentally. Let's see what might help.",
            mood="stressed",
            action="suggest_exercise",
            exercise="Try the military sleep method: Relax your face, drop your shoulders, breathe out slowly, relax your legs, then clear your mind for 10 seconds.",
            resources={
                "tips": ["Avoid screens 30 minutes before bed — blue light suppresses melatonin.",
                         "A consistent sleep schedule (same time daily) is one of the most effective interventions."]
            }
        )

    # ── 19. General positive ──────────────────────────────────────────────────
    if any(w in msg_lower for w in ["happy", "great", "amazing", "excited", "good", "wonderful", "fantastic", "awesome"]):
        return _build_response(
            reply="That's wonderful to hear! 🌟 Positive moments are worth celebrating. What's making things feel good right now?",
            mood="happy",
            confidence=0.85
        )

    # ── 20. Help request ──────────────────────────────────────────────────────
    if re.search(r"\bhelp\b|\badvice\b|\bwhat should i do\b|\bnot sure what to do\b", msg_lower):
        return _build_response(
            reply="Of course, I'm here to help! Could you tell me a bit more about what's going on? The more context you share, the better I can support you."
        )

    # ── 21. Questions (who/what/where/when/why/how) ───────────────────────────
    if re.match(r"^(who|what|where|when|why|how|is|are|can|does|do|did|will|should|could|would)\b", msg_lower):
        return _build_response(
            reply=(
                "That's a great question! I'm currently in offline mode, so I can't look that up right now. "
                "For detailed answers, you might want to check a search engine — but I'm happy to discuss what I do know. "
                "What aspect are you most curious about?"
            )
        )

    # ── 22. Generic catch-all ────────────────────────────────────────────────
    catch_all_replies = [
        "I hear you. Could you tell me a bit more about what's on your mind?",
        "That's interesting — I'd love to understand more. Can you expand on that?",
        "Thank you for sharing that with me. How does that make you feel?",
        "I'm here and listening. What would be most helpful right now — to talk it through, or to find some strategies?",
        "Got it. Where would you like to go from here?"
    ]
    return _build_response(reply=random.choice(catch_all_replies))
