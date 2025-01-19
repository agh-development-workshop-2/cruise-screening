from rest_framework import serializers
from .models import LiteratureReview, KnowledgeArea, Organisation
from django.contrib.auth import get_user_model

User = get_user_model()

class LiteratureReviewSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    discipline = serializers.PrimaryKeyRelatedField(queryset=KnowledgeArea.objects.all())
    organisation = serializers.PrimaryKeyRelatedField(queryset=Organisation.objects.all())
    project_deadline = serializers.DateField()

    class Meta:
        model = LiteratureReview
        fields = [
            'id', 'title', 'description', 'additional_description', 'discipline',  # Added 'discipline' here
            'tags', 'search_databases', 'review_type', 'project_deadline', 'organisation',
            'annotations_per_paper', 'search_queries', 'criteria', 'created_by', 'created_at',
            'updated_at', 'data_format_version', 'ready_for_screening', 'search_updated_at',
            'papers_updated_at', 'papers'
        ]
    
    def create(self, validated_data):
        # Automatically assign the current user to `created_by`
        user = self.context.get('request').user
        validated_data['created_by'] = user
        
        # Create and return the new LiteratureReview instance
        return LiteratureReview.objects.create(**validated_data)