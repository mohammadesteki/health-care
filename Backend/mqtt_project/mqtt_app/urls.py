from django.urls import path

from . import views

urlpatterns = [
    path("", views.results, name="results"),
    path("gps", views.gps_results, name="gps_results"),
]
