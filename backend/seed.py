from app import create_app, db
from app.models.resource import Resource

app = create_app()

content = """Managing Stress in the Workplace

Introduction

Stress in the workplace is a common problem faced by employees across many industries. It occurs when work demands exceed a person’s ability to cope with them. Long working hours, heavy workloads, tight deadlines, and lack of support from colleagues or management can lead to stress. If not managed properly, workplace stress can affect both mental and physical health and reduce productivity. Therefore, learning how to manage stress effectively is important for maintaining a healthy and productive work environment.

Causes of Workplace Stress

There are many factors that can cause stress at work. One of the most common causes is excessive workload and pressure to meet deadlines. When employees feel they have little control over their work or face unrealistic expectations, stress levels increase. Poor communication, unclear job roles, and lack of support from supervisors can also contribute to stress. Additionally, an unhealthy work environment, job insecurity, and poor work-life balance are major factors that can negatively affect employees’ well-being.

Effects of Workplace Stress

Workplace stress can have serious effects on individuals and organizations. Employees experiencing stress may feel tired, anxious, or unmotivated. Over time, stress can lead to health problems such as headaches, high blood pressure, and depression. It can also reduce concentration and decision-making ability. For organizations, stress may result in low productivity, high absenteeism, and increased employee turnover.

Ways to Manage Stress in the Workplace

There are several effective strategies to manage stress at work.

1. Time Management
Proper time management helps employees handle tasks efficiently. Breaking large tasks into smaller steps and setting priorities can reduce pressure and improve productivity.

2. Take Regular Breaks
Taking short breaks during work allows the mind and body to relax. A short walk, stretching, or simply stepping away from the desk can help restore energy and improve focus.

3. Maintain Work-Life Balance
Balancing work with personal life is essential for reducing stress. Setting boundaries such as avoiding work emails after office hours can help maintain mental well-being.

4. Exercise and Healthy Lifestyle
Regular physical activity, healthy eating, and proper sleep can improve mood and reduce stress levels. Exercise increases energy and helps the body cope better with pressure.

5. Seek Support and Communicate
Talking to colleagues, friends, or family members about stress can provide emotional support. Open communication with supervisors can also help solve work-related problems and reduce pressure.

Role of Organizations

Organizations also play an important role in managing workplace stress. Employers can create a supportive environment by improving communication, defining job roles clearly, offering flexible work arrangements, and promoting mental health programs. When employees feel valued and supported, stress levels decrease and productivity improves.

Conclusion

Managing stress in the workplace is essential for both employees and organizations. By practicing effective time management, maintaining a healthy lifestyle, communicating openly, and creating supportive work environments, stress can be reduced significantly. A workplace that promotes mental well-being not only improves employee satisfaction but also leads to better performance and long-term success."""

with app.app_context():
    existing = Resource.query.filter_by(title="Managing Stress in the Workplace").first()
    if existing:
        existing.content = content
        db.session.commit()
        print("Updated existing article.")
    else:
        new_resource = Resource(
            title="Managing Stress in the Workplace",
            description="Learn effective techniques to handle occupational stress and avoid burnout.",
            type="article",
            content=content
        )
        db.session.add(new_resource)
        db.session.commit()
        print("Inserted new article.")
