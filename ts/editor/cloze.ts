// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
import type WithShortcuts from "editor-toolbar/WithShortcuts.svelte";
import type { WithShortcutsProps } from "editor-toolbar/WithShortcuts";
import type { DynamicSvelteComponent } from "sveltelib/dynamicComponent";

import * as tr from "anki/i18n";
import { iconButton, withShortcuts } from "editor-toolbar/dynamicComponents";

import bracketsIcon from "./code-brackets.svg";

import { forEditorField } from ".";
import { wrap } from "./wrap";

const clozePattern = /\{\{c(\d+)::/gu;
function getCurrentHighestCloze(increment: boolean): number {
    let highest = 0;

    forEditorField([], (field) => {
        const fieldHTML = field.editingArea.editable.fieldHTML;
        const matches: number[] = [];
        let match: RegExpMatchArray | null = null;

        while ((match = clozePattern.exec(fieldHTML))) {
            matches.push(Number(match[1]));
        }

        highest = Math.max(highest, ...matches);
    });

    if (increment) {
        highest++;
    }

    return Math.max(1, highest);
}

function onCloze(event: MouseEvent): void {
    const highestCloze = getCurrentHighestCloze(!event.altKey);
    wrap(`{{c${highestCloze}::`, "}}");
}

export function getClozeButton(): DynamicSvelteComponent<typeof WithShortcuts> &
    WithShortcutsProps {
    return withShortcuts({
        shortcuts: ["Control+Shift+KeyC", "Control+Alt+Shift+KeyC"],
        button: iconButton({
            id: "cloze",
            icon: bracketsIcon,
            onClick: onCloze,
            tooltip: tr.editingClozeDeletionCtrlandshiftandc(),
        }),
    });
}
