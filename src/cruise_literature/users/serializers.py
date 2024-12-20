from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Language, KnowledgeArea

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    email = serializers.EmailField(
        required=False,
        help_text=(
            "It is not required but it is the only way to recover your password if you forget it. "
            "You will be able to add it later."
        )
    )

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password1",
            "password2",
        )

    def validate(self, data):
        if data.get('password1') != data.get('password2'):
            raise serializers.ValidationError({"password2": "Passwords must match."})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name', 'name_native', 'iso_639_1']

class KnowledgeAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeArea
        fields = ['id', 'name', 'group']

class EditUserSerializer(serializers.ModelSerializer):
    languages = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Language.objects.all(), required=False
    )
    knowledge_areas = serializers.PrimaryKeyRelatedField(
        many=True, queryset=KnowledgeArea.objects.all(), required=False
    )

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'email',
            'date_of_birth',
            'location',
            'languages',
            'knowledge_areas',
            'allow_logging',
        ]

    def update(self, instance, validated_data):
        # Handle ManyToMany relationships
        if 'languages' in validated_data:
            instance.languages.set(validated_data.pop('languages'))
        if 'knowledge_areas' in validated_data:
            instance.knowledge_areas.set(validated_data.pop('knowledge_areas'))

        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class UserProfileSerializer(serializers.ModelSerializer):
    languages = LanguageSerializer(many=True, read_only=True)
    knowledge_areas = KnowledgeAreaSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'date_of_birth',
            'location',
            'languages',
            'knowledge_areas',
            'allow_logging',
        ]
