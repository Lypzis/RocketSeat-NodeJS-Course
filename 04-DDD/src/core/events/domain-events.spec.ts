import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// Publish - creates event
class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

// subdomains will 'talk' with each other without
// having any interaction between themselves
describe('Domain Events', () => {
  it('should be able to dispatch and listen events', () => {
    const callbackSpy = vi.fn()

    // Subscriber registered (Listening to the event from 'created answer')
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Creating an answer but WITHOUT saving it in the database
    const aggregate = CustomAggregate.create()

    // Assuring that the event event was created but not dispatched yet
    expect(aggregate.domainEvents).toHaveLength(1)

    // Saving the answer in database and then dispatching the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The subscriber listens the event and does what needs to be done
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
