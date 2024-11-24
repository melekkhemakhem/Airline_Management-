from django.db import models

class Flight(models.Model):
    flight_number = models.CharField(max_length=20, unique=True)
    departure = models.CharField(max_length=100)
    arrival = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.flight_number}: {self.departure} → {self.arrival}"
