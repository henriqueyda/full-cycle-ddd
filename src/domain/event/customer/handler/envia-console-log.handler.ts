import EventHandlerInterface from "../../@shared/event-handler.interface";
import AddressChangedEvent from "../address-changed.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<AddressChangedEvent>{
    handle(event: any): void {
        console.log(`Endereço do cliente: ${event["eventData"]["id"]}, ${event["eventData"]["name"]} alterado para: ${event["eventData"]["address"]}`)
    }
}