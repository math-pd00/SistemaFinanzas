import type { Enums } from '@/types/database.types';

// Sign is presentation only: the DB stores expenses positive and adjustments already signed.
export interface IDisplayAmount {
  cents: number;
  tone: 'label' | 'positive';
}

export const toDisplayAmount = (type: Enums<'transaction_type'>, amountCents: number): IDisplayAmount => {
  switch (type) {
    case 'income':
      return { cents: amountCents, tone: 'positive' };
    case 'expense':
    case 'interest':
    case 'fee':
      return { cents: -amountCents, tone: 'label' };
    case 'adjustment':
    case 'payment':
    case 'transfer':
      return { cents: amountCents, tone: 'label' };
  }
};
