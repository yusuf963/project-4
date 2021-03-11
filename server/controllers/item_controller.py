from flask import Blueprint, request, g
from models.item import Item
from serializers.item import ItemSchema
from decorators.secure_route import secure_route
from marshmallow.exceptions import ValidationError

item_schema = ItemSchema()

router = Blueprint(__name__, 'items')


@router.route("/items", methods=["GET"])
def get_all_items():
    items = Item.query.all()
    return {"message": "hello"},
    # return item_schema.jsonify(items, many=True), 200


@router.route("/items.<int:item_id>", methods=["Get"])
def get_single_item(item_id):
    item = Item.query.get(item_id)
    if not item_id:
        return {"message": "Cake not found"}, 404
    return item_schema.jsonify(item), 200


@router.route("/items", methods=["POST"])
@secure_route
def create_item():
    item_dictionary = request.json

    try:
        item = item_schema.load(item_dictionary)
        item.user = g.current_user
    except ValidationError as e:
        return {"errors": e.messages, "messages": "Something went wrong"}
    item.save()
    return item_schema.jsonify(item), 200


@router.route("/items/<int:item_id>", methods=["PUT"])
def update_ite(item_id):
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
def remove_cake(item_id):
    item = Item.query.get(item_id)
    if item.user != g.current_user:
        return {'errors': 'This is not your cake!'}, 402
    item.remove()
    return {"message": "Cake deleted successfully"}, 200
