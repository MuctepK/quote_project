from django.db import models

STATUS_CHOICES = [
    ('new', 'Новая'),
    ('verified', 'Проверен')
]
STATUS_DEFAULT_CHOICE = 'new'
STATUS_VERIFIED_CHOICE = "verified"


class Quote(models.Model):
    text = models.TextField(verbose_name='Текст цитаты')
    author = models.CharField(max_length=128, verbose_name='Автор')
    email = models.EmailField(verbose_name='Почта автора')
    status = models.CharField(max_length=128, verbose_name='Статус', choices=STATUS_CHOICES, default=STATUS_DEFAULT_CHOICE, blank=True)
    rating = models.IntegerField(verbose_name='Рейтинг', default=0, blank=True)
    created_at = models.DateField(verbose_name='Дата создания', auto_now_add=True, blank=True)

