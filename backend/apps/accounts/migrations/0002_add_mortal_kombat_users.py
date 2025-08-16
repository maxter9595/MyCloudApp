# Added by Django 4.2 Developer for test on 2025-08-16 13:53

from django.contrib.auth.hashers import make_password
from django.db import migrations


def create_mk_users(apps, schema_editor):
    CustomUser = apps.get_model('accounts', 'CustomUser')
    
    mortal_kombat_users = [
        {
            'username': 'scorpion123',
            'email': 'scorpion@mk.com',
            'full_name': 'Hanzo Hasashi',
            'password': 'GetOverHere!123',
            'max_storage': 5368709120,
        },
        {
            'username': 'subzero456',
            'email': 'subzero@mk.com',
            'full_name': 'Kuai Liang',
            'password': 'IceClone$456',
            'max_storage': 5368709120,
        },
        {
            'username': 'liukang789',
            'email': 'liukang@mk.com',
            'full_name': 'Liu Kang',
            'password': 'BicycleKick*789',
            'max_storage': 5368709120,
        },
        {
            'username': 'raiden321',
            'email': 'raiden@mk.com',
            'full_name': 'Raiden',
            'password': 'GodOfThunder#321',
            'max_storage': 5368709120,
        },
        {
            'username': 'johnnyc654',
            'email': 'johnny@mk.com',
            'full_name': 'Johnny Cage',
            'password': 'HollywoodStar@654',
            'max_storage': 5368709120,
        },
        {
            'username': 'sonya987',
            'email': 'sonya@mk.com',
            'full_name': 'Sonya Blade',
            'password': 'MilitaryGrade!987',
            'max_storage': 5368709120,
        },
        {
            'username': 'jax567',
            'email': 'jax@mk.com',
            'full_name': 'Jackson Briggs',
            'password': 'MetalArms$567',
            'max_storage': 5368709120,
        },
        {
            'username': 'kitana890',
            'email': 'kitana@mk.com',
            'full_name': 'Kitana',
            'password': 'FanOfDeath%890',
            'max_storage': 5368709120,
        },
    ]
    
    for user_data in mortal_kombat_users:
        user = CustomUser(
            username=user_data['username'],
            email=user_data['email'],
            full_name=user_data['full_name'],
            password=make_password(user_data['password']),
            max_storage=user_data.get('max_storage', 5368709120),
            is_active=True,
            is_staff=user_data.get('is_staff', False),
            is_superuser=user_data.get('is_superuser', False),
        )
        user.save()

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]
    
    operations = [
        migrations.RunPython(create_mk_users),
    ]
