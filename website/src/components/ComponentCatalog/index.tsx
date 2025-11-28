import React from 'react';
import styles from './styles.module.css';
import Admonition from '@theme/Admonition';
import Recipe from '@site/static/img/recipe.svg';

export interface ComponentCatalogProps {
    isMandatory: boolean;
    mustBeADirectChild?: boolean;
    noChildren?: boolean;
    children?: React.ReactNode;
}

type SubComponent = React.ReactElement<{ children: React.ReactNode }>;

function Container({
    isMandatory,
    mustBeADirectChild,
    noChildren,
    children,
}: ComponentCatalogProps) {
    const childrenList = React.Children.toArray(children).filter(
        (child): child is SubComponent => React.isValidElement(child)
    );
    const validParent = childrenList.find((child) => child.type === Parent)
        ?.props.children;

    const validChildren = childrenList.find((child) => child.type === Children)
        ?.props.children;

    return (
        <Admonition
            type="info"
            icon={<Recipe />}
            title="Recipe"
            className={styles.admonition}
        >
            <div className={styles.container}>
                {!noChildren && (
                    <>
                        <div className={styles.title}>Type</div>
                        <div>{isMandatory ? 'Mandatory' : 'Optional'}</div>
                        <div className={styles.border} />
                    </>
                )}
                <div className={styles.title}>Valid Parent</div>
                <div>
                    {mustBeADirectChild
                        ? 'Direct child of '
                        : 'Direct or indirect child of '}
                    {validParent ?? 'Any components'}
                </div>
                {!noChildren && (
                    <>
                        <div className={styles.border} />
                        <div className={styles.title}>Valid Children</div>
                        <div>{validChildren ?? 'Any components'}</div>
                    </>
                )}
            </div>
        </Admonition>
    );
}

function Parent({ children }: { children: React.ReactNode }) {
    return children;
}

function Children({ children }: { children: React.ReactNode }) {
    return children;
}

const ComponentCatalog = {
    Container,
    Parent,
    Children,
};

export default ComponentCatalog;
