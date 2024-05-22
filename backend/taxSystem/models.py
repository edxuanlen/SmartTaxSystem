from django.db import models

# Create your models here.

# class Employee(models.Model):
#     name = models.CharField(max_length=100)
#     salary = models.DecimalField(max_digits=10, decimal_places=2)
#     # 其他字段...

# class TaxRecord(models.Model):
#     employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
#     pre_tax_salary = models.DecimalField(max_digits=10, decimal_places=2)
#     post_tax_salary = models.DecimalField(max_digits=10, decimal_places=2)
#     # 其他字段...
