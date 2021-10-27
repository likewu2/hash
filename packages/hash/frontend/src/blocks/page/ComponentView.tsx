import {
  blockComponentRequiresText,
  BlockMeta,
  componentIdToUrl,
} from "@hashintel/hash-shared/blockMeta";
import {
  EntityStoreType,
  isBlockEntity,
} from "@hashintel/hash-shared/entityStore";
import { entityStoreFromProsemirror } from "@hashintel/hash-shared/entityStorePlugin";
import { ProsemirrorNode } from "@hashintel/hash-shared/node";
import { Schema } from "prosemirror-model";
import { EditorView, NodeView } from "prosemirror-view";
import React from "react";
import { BlockLoader } from "../../components/BlockLoader/BlockLoader";
import { RenderPortal } from "./usePortals";

// @todo we need to type this such that we're certain we're passing through all
// the props required
const getRemoteBlockProps = (entity: EntityStoreType | null | undefined) => {
  if (entity) {
    if (!isBlockEntity(entity)) {
      throw new Error("Cannot prepare non-block entity for prosemirrior");
    }

    const childEntity = entity.properties.entity;

    return {
      accountId: childEntity.accountId,
      childEntityId: childEntity.entityId,
      properties: "properties" in childEntity ? childEntity.properties : {},
    };
  }

  return { properties: {} };
};

export class ComponentView implements NodeView<Schema> {
  dom: HTMLDivElement = document.createElement("div");
  contentDOM: HTMLElement | undefined = undefined;
  editable: boolean;

  private target = document.createElement("div");

  private readonly componentId: string;
  private readonly sourceName: string;

  constructor(
    node: ProsemirrorNode<Schema>,
    public view: EditorView<Schema>,
    public getPos: () => number,
    private renderPortal: RenderPortal,
    private meta: BlockMeta
  ) {
    const { componentMetadata, componentSchema } = meta;
    const { source } = componentMetadata;

    if (!source) {
      throw new Error("Cannot create new block for component missing a source");
    }

    this.sourceName = source;
    this.componentId = componentMetadata.componentId;

    this.dom.setAttribute("data-dom", "true");

    this.editable = blockComponentRequiresText(componentSchema);

    if (this.editable) {
      this.contentDOM = document.createElement("div");
      this.contentDOM.setAttribute("data-contentDOM", "true");
      this.contentDOM.style.display = "none";
      this.dom.appendChild(this.contentDOM);
    }

    this.target.setAttribute("data-target", "true");

    this.dom.appendChild(this.target);

    this.update(node);
  }

  update(node: any) {
    const entityStore = entityStoreFromProsemirror(this.view.state).store;

    if (node?.type.name === this.componentId) {
      const entityId = node.attrs.entityId;
      // @todo probably ought to use draft
      const entity = entityStore.saved[entityId];
      const remoteBlockProps = getRemoteBlockProps(entity);

      const editableRef = this.editable
        ? (editableNode: HTMLElement) => {
            if (
              this.contentDOM &&
              editableNode &&
              !editableNode.contains(this.contentDOM)
            ) {
              editableNode.appendChild(this.contentDOM);
              this.contentDOM.style.display = "";
            }
          }
        : undefined;

      const mappedUrl = componentIdToUrl(this.componentId);

      this.renderPortal(
        <BlockLoader
          {...remoteBlockProps}
          sourceUrl={`${mappedUrl}/${this.sourceName}`}
          editableRef={editableRef}
          shouldSandbox={!editableRef}
        />,
        this.target
      );

      return true;
    } else {
      return false;
    }
  }

  destroy() {
    this.dom.remove();
    this.renderPortal(null, this.target);
  }

  // @todo type this
  stopEvent(evt: any) {
    if (evt.type === "dragstart") {
      evt.preventDefault();
    }

    return true;
  }

  ignoreMutation(evt: any) {
    return !(
      !evt.target ||
      (evt.target !== this.contentDOM && this.contentDOM?.contains(evt.target))
    );
  }
}
