import { createStore, combineReducers } from 'redux';
import { tableReducer } from './reducers/reducers';
import { CharacterTableState } from './components/characters-table';

export type State = {
    charactersTable: CharacterTableState;
};

const store = createStore(
    combineReducers<State>({
        charactersTable: tableReducer,
    }),
);

export default store;
