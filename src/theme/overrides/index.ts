import {merge} from 'lodash';

import Button from './button';
import Card from './card';
import Input from './input';
import Paper from './paper';

export default function ComponentsOverrides(theme: any): any {
    return merge(
        Button(theme),
        Paper(theme),
        Input(theme),
        Card(theme),
    );
}
 