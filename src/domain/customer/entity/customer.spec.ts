import PushMessageWhenCustomerIsCreatedHandler from "../event/handler/push-message-when-customer-is-created.handler";
import SendEmailWhenCustomerIsCreatedHandler from "../event/handler/send-email-when-customer-is-created.handler";
import SendNotificationWhenCustomerAddressIsChangedHandler from "../event/handler/send-notification-when-customer-address-is-changed.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");

    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);

  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("should notify when customer is created", () => {
    const spyEmail = jest.spyOn(SendEmailWhenCustomerIsCreatedHandler.prototype, "handle");
    const spyPush = jest.spyOn(PushMessageWhenCustomerIsCreatedHandler.prototype, "handle");

    const customer = new Customer("1", "Customer 1");

    expect(spyEmail).toHaveBeenCalled();
    expect(spyPush).toHaveBeenCalled();
  });

  it("should notify when customer address is changed", () => {
    const spy = jest.spyOn(SendNotificationWhenCustomerAddressIsChangedHandler.prototype, "handle");

    const customer = new Customer("1", "Customer 1");

    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    
    customer.Address = address;
    expect(spy).toHaveBeenCalled();
    
    const address2 = new Address("Street 2", 456, "13330-270", "Minas Gerais");

    customer.changeAddress(address2);

    expect(spy).toHaveBeenCalled();

  });
});
