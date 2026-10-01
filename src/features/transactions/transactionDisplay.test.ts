import type { Enums } from '../../types/database.types';
import { toDisplayAmount, type IDisplayAmount } from './transactionDisplay';

describe('toDisplayAmount', () => {
  it.each<[Enums<'transaction_type'>, number, IDisplayAmount]>([
    ['income', 5000, { cents: 5000, tone: 'positive' }],
    ['expense', 5000, { cents: -5000, tone: 'label' }],
    ['interest', 5000, { cents: -5000, tone: 'label' }],
    ['fee', 5000, { cents: -5000, tone: 'label' }],
    ['adjustment', -5000, { cents: -5000, tone: 'label' }],
    ['adjustment', 5000, { cents: 5000, tone: 'label' }],
    ['payment', 5000, { cents: 5000, tone: 'label' }],
    ['transfer', 5000, { cents: 5000, tone: 'label' }],
  ])('%s %p', (type, amountCents, expected) => {
    expect(toDisplayAmount(type, amountCents)).toEqual(expected);
  });
});
