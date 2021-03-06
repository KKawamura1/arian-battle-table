import actionCreatorFactory from 'typescript-fsa';
import { loadCharactersActions } from './load-characters';
import { saveCharactersActions } from './save-characters';
import { saveCharactersNewlyActions } from './save-characters-newly';
import { ButtonDropdownValue } from '../../components/atoms/button-dropdown';
import { Character } from '../../types/character';
import { loadSkillsCsvActions } from './load-skills-csv';

export type CharacterID = string;
export type CharacterName = string;
export type SkillName = string;

export type ChangeSessionNameProps = { e: React.ChangeEvent<HTMLInputElement> };
export type ChangeActionProps<T> = {
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    payload: T;
};
export type MouseActionProps<T> = {
    e: React.MouseEvent<HTMLInputElement | HTMLLIElement, MouseEvent>;
    payload: T;
};
export type ClickDropDownListItemProps = {
    key: string;
    value: ButtonDropdownValue;
    characterId: CharacterID;
};
export type MoveSkillProps = { characterID: CharacterID; dragIdx: number; dropIdx: number };

export type ActionTypes =
    | 'UPDATE_SESSION_NAME_TEXT'
    | 'UPDATE_CHARACTER_ATTRIBUTE_NUMBER_TEXT'
    | 'UPDATE_CHARACTER_ATTRIBUTE_TEXT'
    | 'UPDATE_SKILL_ATTRIBUTE_TEXT'
    | 'UPDATE_CHARACTER_IS_KNOCKBACK'
    | 'UPDATE_BUTTON_DROPDOWN_BAD_STATUS'
    | 'UPDATE_CHARACTER_DROPDOWN'
    | 'DELETE_CHARACTER'
    | 'DELETE_SKILL'
    | 'MOVE_SKILL'
    | 'COPY_CHARACTER'
    | 'OPEN_CHARACTER_DETAILS'
    | 'UPDATE_CURRENT_NEW_CHARACTER_NAME'
    | 'ADD_NEW_CHARACTER'
    | 'ADD_NEW_SKILL'
    | 'LOAD_CHARACTERS'
    | 'SAVE_CHARACTERS'
    | 'SAVE_CHARACTERS_NEWLY'
    | 'OPEN_DELETION_MODAL'
    | 'CLOSE_MODAL';

const actionCreator = actionCreatorFactory();

export const actions = {
    updateSessionName: actionCreator<ChangeSessionNameProps>('UPDATE_SESSION_NAME_TEXT'),
    updateCharacterAttributeNumberText: actionCreator<ChangeActionProps<CharacterID>>(
        'UPDATE_CHARACTER_ATTRIBUTE_NUMBER_TEXT',
    ),
    updateCharacterAttributeText: actionCreator<ChangeActionProps<CharacterID>>('UPDATE_CHARACTER_ATTRIBUTE_TEXT'),
    updateSkillAttributeText: actionCreator<ChangeActionProps<{ characterID: CharacterID; skillIndex: number }>>(
        'UPDATE_SKILL_ATTRIBUTE_TEXT',
    ),
    updateCharacterCheckbox: actionCreator<ChangeActionProps<CharacterID>>('UPDATE_CHARACTER_IS_KNOCKBACK'),
    updateButtonDropdownBadStatus: actionCreator<ClickDropDownListItemProps>('UPDATE_BUTTON_DROPDOWN_BAD_STATUS'),
    updateCharacterAttributeDropdown: actionCreator<ChangeActionProps<CharacterID>>('UPDATE_CHARACTER_DROPDOWN'),
    openDeletionModal: actionCreator<MouseActionProps<CharacterID>>('OPEN_DELETION_MODAL'),
    closeModal: actionCreator('CLOSE_MODAL'),
    deleteCharacter: actionCreator('DELETE_CHARACTER'),
    deleteSkill: actionCreator<MouseActionProps<{ characterID: CharacterID; skillName: SkillName }>>(
        'DELETE_SKILL',
    ),
    moveSkill: actionCreator<MoveSkillProps>('MOVE_SKILL'),
    copyCharacter: actionCreator<{ character: Character }>('COPY_CHARACTER'),
    openCharacterDetails: actionCreator<MouseActionProps<CharacterID>>('OPEN_CHARACTER_DETAILS'),
    updateCurrentNewCharacterName: actionCreator<React.ChangeEvent<HTMLInputElement>>('UPDATE_CURRENT_NEW_CHARACTER_NAME'),
    addNewCharacter: actionCreator('ADD_NEW_CHARACTER'),
    addNewSkill: actionCreator('ADD_NEW_SKILL'),
    ...loadCharactersActions,
    ...saveCharactersActions,
    ...saveCharactersNewlyActions,
    ...loadSkillsCsvActions,
};
