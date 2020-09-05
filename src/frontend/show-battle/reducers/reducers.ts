import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { CharacterTableState, Character, CharacterProps } from '../components/characters-table';
import { actions } from '../actions/actions';
import { BadStatus } from '../actions/bad-status';
import { Attribute } from '../actions/attribute';
import { updateItemInArray, updateObject } from '../../utils/reducer-commons';

const initialState: CharacterTableState = {
    sessionName: '',
    characters: [],
    currentNewCharacter: Character(),
    deleteCharacterName: '',
    isModalOpen: false,
};

function characterSelector(characterName: string) {
    return (character: CharacterProps) => character.name === characterName;
}

// TODO: キャラクター名で filter するの結構微妙みあるからできれば id とかをちゃんと扱うようにしたいかも。
export const tableReducer = reducerWithInitialState(initialState)
    .case(actions.updateSessionNameText, (state, props) => {
        const { e } = props;
        return { ...state, sessionName: e.target.value };
    })
    .case(actions.updateCharacterAttributeText, (state, props) => {
        const { e, name } = props;

        const characters = updateItemInArray(state.characters, characterSelector(name), item => {
            if (e.target.value === '' || e.target.value === '-') {
                return updateObject(item, { [e.target.name as keyof CharacterProps]: e.target.value });
            }

            const targetValue: number = parseInt(e.target.value);
            if (!isNaN(targetValue)) {
                return updateObject(item, { [e.target.name as keyof CharacterProps]: targetValue });
            } else {
                return item;
            }
        });

        characters.sort((a, b) => b.actionPriority - a.actionPriority);

        return { ...state, characters };
    })
    .case(actions.updateCharacterCheckbox, (state, props) => {
        const { e, name } = props;
        const action = e.target.name;

        let characters;

        if (action === 'isActed') {
            characters = updateItemInArray(state.characters, characterSelector(name), item =>
                updateObject(item, { isActed: !item.isActed }),
            );
        } else {
            characters = updateItemInArray(state.characters, characterSelector(name), item =>
                updateObject(item, {
                    badStatus: updateObject(item.badStatus, {
                        [action]: !item.badStatus[action as keyof BadStatus],
                    }),
                }),
            );
        }

        return { ...state, characters };
    })
    .case(actions.updateButtonDropdownBadStatus, (state, props) => {
        const { key, value, name } = props;

        const characters = updateItemInArray(state.characters, characterSelector(name), item => {
            // knockback の更新 -> 行動値の更新 という2ステップを同時に行えないので updateObject を2回呼んでいる。
            const tmp = updateObject(item, {
                badStatus: updateObject(item.badStatus, {
                    [key]: value,
                }),
            });

            return updateObject(tmp, {
                actionPriority: tmp.actionPriority - (tmp.badStatus.knockback - item.badStatus.knockback) * 5,
            });
        });

        if (key === 'knockback') {
            characters.sort((a, b) => b.actionPriority - a.actionPriority);
        }

        return { ...state, characters };
    })
    .case(actions.updateCharacterDropdown, (state, props) => {
        const { e, name } = props;

        const characters = updateItemInArray(state.characters, characterSelector(name), item =>
            updateObject(item, { attribute: e.target.value as Attribute }),
        );

        return { ...state, characters };
    })
    .case(actions.openDeletionModal, (state, props) => {
        return { ...state, isModalOpen: true, deleteCharacterName: props.name };
    })
    .case(actions.closeDeletionModal, (state, _props) => {
        return { ...state, isModalOpen: false };
    })
    .case(actions.copyCharacter, (state, props) => {
        let { character } = props;

        const names = state.characters.map(x => x.name);
        let characterName = character.name;

        while (true) {
            if (names.includes(characterName)) {
                characterName = `${characterName}__copy`;
            } else {
                break;
            }
        }

        character = { ...character, name: characterName };

        const characters: CharacterProps[] = [...state.characters, character].slice().map(x => ({ ...x }));

        return { ...state, characters };
    })
    .case(actions.deleteCharacter, (state, _) => {
        const { deleteCharacterName: name } = state;
        const characters = state.characters
            .slice()
            .map(x => ({ ...x }))
            .filter(x => x.name !== name);

        return { ...state, characters, isModalOpen: false, deleteCharacterName: '' };
    })
    .case(actions.updateCurrentNewCharacter, (state, props) => {
        const currentNewCharacter = Character(props.target.value);

        return { ...state, currentNewCharacter };
    })
    .case(actions.addNewCharacter, state => {
        const characters = state.characters.slice().map(x => ({ ...x }));

        if (characters.some(x => x.name === state.currentNewCharacter.name)) {
            window.alert('すでに存在しているキャラクター名です。キャラクター名は別のものを入力してください。');
            return state;
        }

        if (state.currentNewCharacter.name === '') {
            window.alert('キャラクターネームが空白です。');
            return state;
        }

        characters.push(state.currentNewCharacter);
        characters.sort((a, b) => b.actionPriority - a.actionPriority);

        return { ...state, characters, currentNewCharacter: Character() };
    })
    .case(actions.doneLoadingCharacters, (state, props) => {
        return { ...state, sessionName: props.result.sessionName, characters: props.result.characters };
    })
    .default(state => {
        console.log('The default reducer is used.');
        return state;
    });
