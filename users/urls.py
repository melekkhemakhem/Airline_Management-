from django.urls import path
from .views import user_detail,register,login_user,get_id_by_email

urlpatterns = [
    path('', user_detail, name='user-list'),  # GET all or POST
    path('<int:id>/', user_detail, name='user-detail'),  # GET/PUT/DELETE by ID
     path('register/', register, name='register'),  # Registration route
    path('login/', login_user, name='login'), 
     path('email/id/', get_id_by_email, name='get-id-by-email'),  # Nouvelle route pour obtenir l'ID par e-mail
]
