from django.db import migrations


def create_free_plan(apps, schema_editor):
    Plan = apps.get_model("orcamenter", "Plan")

    Plan.objects.get_or_create(
        code="FREE",
        defaults={"name": "Plano Free", "max_orcaments": 10000000, "price": 0},
    )


class Migration(migrations.Migration):
    dependencies = [
        ("orcamenter", "0010_subscription"),
    ]

    operations = [
        migrations.RunPython(create_free_plan),
    ]
