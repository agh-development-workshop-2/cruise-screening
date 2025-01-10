from rest_framework import serializers
from .models import LiteratureReview

class LiteratureReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiteratureReview
        fields = [
            "id", 
            "title", 
            "description", 
            "additional_description", 
            "discipline", 
            "tags", 
            "review_type", 
            "project_deadline", 
            "number_of_papers", 
            "number_of_screened", 
            "percentage_screened"
        ]
