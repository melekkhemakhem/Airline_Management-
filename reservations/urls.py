from django.urls import path
from .views import reservation_detail

urlpatterns = [
    path('', reservation_detail, name='reservation-list'),  # GET all or POST
    path('<int:id>/', reservation_detail, name='reservation-detail'),  # GET/PUT/DELETE by ID
]
