from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import CustomUser
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def user_detail(request, id=None):
    if request.method == 'GET':
        if id:  # GET by ID
            user = get_object_or_404(CustomUser, id=id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:  # GET all
            users = CustomUser.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)

    elif request.method == 'POST':  # Create a new user
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':  # Update by ID
        if id:
            user = get_object_or_404(CustomUser, id=id)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "User updated successfully!"})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "ID is required for updating a user."}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':  # Delete by ID
        if id:
            user = get_object_or_404(CustomUser, id=id)
            user.delete()
            return Response({"message": "User deleted successfully!"})
        return Response({"message": "ID is required for deleting a user."}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Récupérer l'utilisateur par son nom d'utilisateur
        user = CustomUser.objects.get(email=username)
        
        # Comparer le mot de passe en texte clair avec le mot de passe haché
        if check_password(password, user.password):
            login(request, user)  # Connecter l'utilisateur pour la session
            return Response({"message": "Login successful!"})
        else:
            return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    except CustomUser.DoesNotExist:
        return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def login_admin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Récupérer l'utilisateur par son nom d'utilisateur
        user = CustomUser.objects.get(username=username)
        
        # Comparer le mot de passe en texte clair avec le mot de passe haché
        if check_password(password, user.password):
            login(request, user)  # Connecter l'utilisateur pour la session
            return Response({"message": "Login successful!"})
        else:
            return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    except CustomUser.DoesNotExist:
        return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
def get_id_by_email(request):
    email = request.query_params.get('email')  # Récupère l'e-mail depuis les paramètres de la requête
    
    if not email:
        return Response({"message": "Email parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
        return Response({"id": user.id})
    except CustomUser.DoesNotExist:
        return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)

