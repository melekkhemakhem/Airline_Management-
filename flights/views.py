from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Flight
from .serializers import FlightSerializer

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def flight_detail(request, id=None):
    if request.method == 'GET':
        if id:  # GET by ID
            flight = get_object_or_404(Flight, id=id)
            serializer = FlightSerializer(flight)
            return Response(serializer.data)
        else:  # GET all
            flights = Flight.objects.all()
            serializer = FlightSerializer(flights, many=True)
            return Response(serializer.data)

    elif request.method == 'POST':  # Create a new flight
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Flight created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':  # Update by ID
        if id:
            flight = get_object_or_404(Flight, id=id)
            serializer = FlightSerializer(flight, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Flight updated successfully!"})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "ID is required for updating a flight."}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':  # Delete by ID
        if id:
            flight = get_object_or_404(Flight, id=id)
            flight.delete()
            return Response({"message": "Flight deleted successfully!"})
        return Response({"message": "ID is required for deleting a flight."}, status=status.HTTP_400_BAD_REQUEST)
