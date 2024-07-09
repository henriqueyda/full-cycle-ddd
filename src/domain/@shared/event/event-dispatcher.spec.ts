import AddressChangedEvent from "../../customer/event/address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    })
    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    })
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
        
        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
        ).toMatchObject(eventHandler);

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);
        
        expect(spyEventHandler).toHaveBeenCalled();
    })

    it("should notify console log 1 and 2 when customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerConsole1 =  new EnviaConsoleLog1Handler();

        const spyEventHandlerConsole1 = jest.spyOn(eventHandlerConsole1, "handle");
        const eventHandlerConsole2 =  new EnviaConsoleLog2Handler();
        const spyEventHandlerConsole2 = jest.spyOn(eventHandlerConsole2, "handle");

        const customerCreatedEvent = new CustomerCreatedEvent(
            {
                id: "123",
                name: "Customer 1",
                age: 20,
            }
        );

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerConsole1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerConsole2);
        
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandlerConsole1);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandlerConsole2);

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandlerConsole1).toHaveBeenCalled();
        expect(spyEventHandlerConsole2).toHaveBeenCalled();

    })

    it("should notify console log when customer address is changed", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerConsole =  new EnviaConsoleLogHandler();
        const spyEventHandlerConsole = jest.spyOn(eventHandlerConsole, "handle");

        const addressChangedEvent = new AddressChangedEvent(
            {
                id: "123",
                name: "Customer 1",
                address: "Address 1",
            }
        );
        eventDispatcher.register("AddressChangedEvent", eventHandlerConsole);

        expect(
            eventDispatcher.getEventHandlers["AddressChangedEvent"][0]
        ).toMatchObject(eventHandlerConsole);
        
        eventDispatcher.notify(addressChangedEvent);

        expect(spyEventHandlerConsole).toHaveBeenCalled();
    })
})