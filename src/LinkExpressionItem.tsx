import { LinkExpression } from '@perspect3vism/ad4m';
import React from 'react';

export default function LinkExpressionItem(link: LinkExpression) {
    console.log('LinkItem: ', link.link.data);
    const { link: { data: { source, predicate, target } } } = link;
    return (
        <li>{source.toString().substring(0,5)} {'<>'} {predicate} {'<>'} {target}</li>
    );
}