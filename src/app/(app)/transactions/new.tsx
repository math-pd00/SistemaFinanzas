import { useState } from 'react';

import { GroupedSection } from '@/components/ui/GroupedSection';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { TransactionForm } from '@/features/transactions/TransactionForm';
import { transactionTypeLabels } from '@/features/transactions/transactionTypeLabels';
import type { TransactionEntryType } from '@/features/transactions/useCreateTransaction';

// Each type mounts its own form, so switching type always starts from empty fields with that type's rules.
const ENTRY_TYPES: TransactionEntryType[] = ['expense', 'income', 'payment', 'transfer', 'interest', 'fee'];

const NewTransaction = () => {
  const [selectedType, setSelectedType] = useState<TransactionEntryType | null>(null);

  return (
    <Screen title="Nuevo movimiento">
      {selectedType === null ? (
        <GroupedSection header="Tipo de movimiento">
          {ENTRY_TYPES.map((type) => (
            <ListRow key={type} title={transactionTypeLabels[type]} onPress={() => setSelectedType(type)} />
          ))}
        </GroupedSection>
      ) : (
        <>
          <GroupedSection>
            <ListRow
              title={transactionTypeLabels[selectedType]}
              subtitle="Tipo de movimiento"
              onPress={() => setSelectedType(null)}
            />
          </GroupedSection>
          <TransactionForm key={selectedType} type={selectedType} />
        </>
      )}
    </Screen>
  );
};

export default NewTransaction;
