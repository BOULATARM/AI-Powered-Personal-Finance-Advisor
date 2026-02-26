from rest_framework import serializers
from django.contrib.auth.models import User


class PredictInputSerializer(serializers.Serializer):
    Income = serializers.FloatField(min_value=0)
    Age = serializers.IntegerField(min_value=18, max_value=100)
    Dependents = serializers.IntegerField(min_value=0, max_value=20)
    Disposable_Income = serializers.FloatField(min_value=0)
    Desired_Savings = serializers.FloatField(min_value=0)

    Groceries = serializers.FloatField(min_value=0)
    Transport = serializers.FloatField(min_value=0)
    Eating_Out = serializers.FloatField(min_value=0)
    Entertainment = serializers.FloatField(min_value=0)
    Utilities = serializers.FloatField(min_value=0)
    Healthcare = serializers.FloatField(min_value=0)
    Education = serializers.FloatField(min_value=0)
    Miscellaneous = serializers.FloatField(min_value=0)

    Occupation = serializers.CharField()
    City_Tier = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data.get("email", "")
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class ChatInputSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000)
    conversation_id = serializers.CharField(required=False, allow_blank=True, max_length=100)
    context = serializers.JSONField(required=False)
