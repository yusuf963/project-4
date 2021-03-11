from app import ma
from models.user import User
from marshmallow import fields

class UserSchema(ma.SQLAlchemyAutoSchema):
	
	class Meta:
		model = User
		load_instance = True
		exclude = ('password_hash',)
		load_only = ('email', 'password')
		
	first_name = fields.String(data_key='firstName')
	last_name = fields.String(data_key='lastName')
	threads = fields.Nested('ThreadSchema', many=True)
	password = fields.String(required=True)