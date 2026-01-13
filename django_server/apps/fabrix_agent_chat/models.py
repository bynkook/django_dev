from django.db import models
from django.contrib.auth.models import User

class ChatSession(models.Model):
    """
    하나의 대화방(주제)을 의미합니다.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    agent_id = models.CharField(max_length=100, help_text="FabriX Agent UUID")
    title = models.CharField(max_length=200, blank=True, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']  # 최신 대화가 위로 오게 정렬

    def __str__(self):
        return f"{self.title} ({self.user.username})"

class ChatMessage(models.Model):
    """
    대화방 내의 개별 메시지를 의미합니다.
    """
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
        ('system', 'System'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']  # 시간순 정렬

    def __str__(self):
        return f"[{self.role}] {self.content[:30]}..."