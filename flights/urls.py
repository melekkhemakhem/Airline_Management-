from django.urls import path
from .views import flight_detail

urlpatterns = [
    path('', flight_detail, name='flight-list'),  # GET all or POST
    path('<int:id>/', flight_detail, name='flight-detail'),  # GET/PUT/DELETE by ID
]
