from flask import Blueprint, request, g
from app import db
from sqlalchemy import func

router = Blueprint(__name__, 'items')

import json
from models.item import Item
# from models.category import Category
from models.user import User
from serializers.item import ItemSchema
from serializers.category import CategorySchema

from marshmallow.exceptions import ValidationError

item_schema = ItemSchema()
category_schema = CategorySchema()

from decorators.secure_route import secure_route


@router.route("/items", methods=["GET"])
def get_all_items():
    items = Item.query.all()
    return item_schema.jsonify(items, many=True), 200


@router.route("/items/<int:item_id>", methods=["GET"])
def get_single_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return {"message": "Item not found"}, 404
    return item_schema.jsonify(item), 200

@router.route('/items/search/<search_criteria>', methods=['POST'])
def get_items_by_search_criteria(search_criteria):
    # search = 
    items = Item.query.filter(Item.title.ilike(f'%{search_criteria}%')).all()
    print(items)
    return item_schema.jsonify(items, many=True), 200

@router.route("/items", methods=["POST"])
@secure_route
def create_item():
    item_dictionary = request.json
    try:
        item = item_schema.load(item_dictionary)
        item.user_id = g.current_user.id
    except ValidationError as e:
        return {"errors": e.messages, "messages": "Something went wrong"}
    item.save()
    return item_schema.jsonify(item), 200


@router.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    existing_item = Item.query.get(item_id)
    item_dictionary = request.json
    try:
        item = item_schema.load(
            item_dictionary,
            instance=existing_item,
            partial=True
        )
    except ValidationError as e:
        return {"errors": e.messages, "messages": "Something went wrong"}
    item.save()
    return item_schema.jsonify(item), 201


@router.route("/items/<int:item_id>", methods=["DELETE"])
@secure_route
def remove_item(item_id):
    item = Item.query.get(item_id)
    if item.user_id != g.current_user.id:
        return {'errors': 'This is not your item!'}, 402
    item.remove()
    return {"message": "Item deleted successfully"}, 200
