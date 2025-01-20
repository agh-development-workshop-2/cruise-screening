from rest_framework import serializers
from organisations.models import Organisation, OrganisationMember
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  
class OrganisationSerializer(serializers.ModelSerializer):
    """Serializer for organisation details."""
    class Meta:
        model = Organisation
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']

class OrganisationMemberSerializer(serializers.ModelSerializer):
    """Serializer for organisation members with user details."""
    member = UserSerializer()  

    class Meta:
        model = OrganisationMember
        fields = ['id', 'organisation', 'member', 'role']
