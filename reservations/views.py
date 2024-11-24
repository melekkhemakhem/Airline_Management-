from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Reservation
from .serializers import ReservationSerializer

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def reservation_detail(request, id=None):
    if request.method == 'GET':
        if id:  # GET by ID
            reservation = get_object_or_404(Reservation, id=id)
            serializer = ReservationSerializer(reservation)
            return Response(serializer.data)
        else:  # GET all
            reservations = Reservation.objects.all()
            serializer = ReservationSerializer(reservations, many=True)
            return Response(serializer.data)

    elif request.method == 'POST':  # Create a new reservation
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Reservation created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':  # Update by ID
        if id:
            reservation = get_object_or_404(Reservation, id=id)
            serializer = ReservationSerializer(reservation, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Reservation updated successfully!"})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "ID is required for updating a reservation."}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':  # Delete by ID
        if id:
            reservation = get_object_or_404(Reservation, id=id)
            reservation.delete()
            return Response({"message": "Reservation deleted successfully!"})
        return Response({"message": "ID is required for deleting a reservation."}, status=status.HTTP_400_BAD_REQUEST)
