import * as React from 'react';
import { TextCheckBox } from '../../components/atoms/text-checkbox';

export type BadStatusCheckboxesProps = {
    badStatusList: BadStatus[];
};

type BadStatus = {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const BadStatusCheckboxes: React.SFC<BadStatusCheckboxesProps> = (props: BadStatusCheckboxesProps) => {
    return (
        <React.Fragment>
            {props.badStatusList.map(prop => (
                <TextCheckBox {...prop} />
            ))}
        </React.Fragment>
    );
};
