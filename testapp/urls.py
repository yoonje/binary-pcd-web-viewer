from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.show_home_page, name='show_home_page'),
]