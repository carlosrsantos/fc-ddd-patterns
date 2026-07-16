import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendEmailWhenCustomerIsCreatedHandler from "../event/handler/send-email-when-customer-is-created.handler";
import PushMessageWhenCustomerIsCreatedHandler from "../event/handler/push-message-when-customer-is-created.handler";
import CustomerCreatedEvent from "../event/customer-created.event";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import SendNotificationWhenCustomerAddressIsChangedHandler from "../event/handler/send-notification-when-customer-address-is-changed.handler";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispatcher: EventDispatcher;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    this._eventDispatcher = new EventDispatcher();
    this.registerEvents();
    this.notityCustomerCreated(this._name);
  }

  registerEvents() {
    this._eventDispatcher.register("CustomerCreatedEvent", new SendEmailWhenCustomerIsCreatedHandler);
    this._eventDispatcher.register("CustomerCreatedEvent", new PushMessageWhenCustomerIsCreatedHandler)
    this._eventDispatcher.register("CustomerAddressChangedEvent", new SendNotificationWhenCustomerAddressIsChangedHandler);
  }

  notityCustomerCreated(name: string) {
    this._eventDispatcher.notify(new CustomerCreatedEvent({ name }));
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }

  changeAddress(address: Address) {
    this._address = address;

    this._eventDispatcher.notify(new CustomerAddressChangedEvent({
      id: this._id,
      name: this._name,
      address: this._address.toString()
    }));
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;

    this._eventDispatcher.notify(new CustomerAddressChangedEvent({
      id: this._id,
      name: this._name,
      address: this._address.toString()
    }));

  }
}
