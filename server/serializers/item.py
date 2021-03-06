from app import ma
from models.item import Item
from marshmallow import fields


class ItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Item
        load_instance = True

    # ! Add my user schema
    user_id = fields.Integer(data_key='user_id')
    # category = fields.Nested('CategorySchema')
    category = fields.Integer(data_key='category')
    postcode = fields.String(data_key='postcode')
