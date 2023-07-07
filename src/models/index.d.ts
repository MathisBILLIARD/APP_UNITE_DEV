import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerUNITE = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UNITE, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly Firstname?: string | null;
  readonly email?: string | null;
  readonly password?: string | null;
  readonly sexe?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUNITE = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UNITE, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Name?: string | null;
  readonly Firstname?: string | null;
  readonly email?: string | null;
  readonly password?: string | null;
  readonly sexe?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UNITE = LazyLoading extends LazyLoadingDisabled ? EagerUNITE : LazyUNITE

export declare const UNITE: (new (init: ModelInit<UNITE>) => UNITE) & {
  copyOf(source: UNITE, mutator: (draft: MutableModel<UNITE>) => MutableModel<UNITE> | void): UNITE;
}