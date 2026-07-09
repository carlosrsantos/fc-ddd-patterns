import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerAddresChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import PushMessageWhenCustomerIsCreatedHandler from "../../customer/event/handler/push-message-when-customer-is-created.handler";
import SendEmailWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-email-when-customer-is-created.handler";
import SendNotificationWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/send-notification-when-customer-address-is-changed.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import { v4 as uuid } from "uuid";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify all customer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerSendEmail = new SendEmailWhenCustomerIsCreatedHandler();
    const eventHandlerPushMessage = new PushMessageWhenCustomerIsCreatedHandler();
    const spyEventHandlerSendEmail = jest.spyOn(eventHandlerSendEmail, "handle");
    const spyEventHandlerPushMessage = jest.spyOn(eventHandlerPushMessage, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandlerSendEmail);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerPushMessage);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerSendEmail);


     expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandlerPushMessage);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandlerSendEmail).toHaveBeenCalled();
    expect(spyEventHandlerPushMessage).toHaveBeenCalled();
  });

  it("should notify when customer address is changed event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendNotificationWhenCustomerAddressIsChangedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const address = new Address("Street 1", 10, "120-000", "City1");

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: uuid(),
      name: "Customer 1",
      address: address.toString()
    });

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });


});
