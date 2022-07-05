import {DataTypes, Model, ModelDefined, Sequelize} from "sequelize"
import * as path from "path"
import {app} from 'electron';

import {Nullable} from "../types/helpersTypes";
import {
    InternalWebsiteAttributes,
    WebsiteAttributes,
    WebsiteCreationAttributes,
    WebsiteMetadata,
    WebsitePicture
} from "../types/website";
import {BookmarkAttributes, BookmarkCreationAttributes, InternalBookmarkAttributes} from "../types/bookmarks";
import {CollectionAttributes, CollectionCreationAttributes} from "../types/collections";
import {TopCollections} from "../utils/collections";
import {BookmarkVariant} from "../utils/bookmarks";
import {ARRAY_SEPARATOR, getWebsitePicture} from "../utils/electron";


export const databasePath = path.join(app.getPath("userData"), "main.db");

export const sequelize: Sequelize = new Sequelize({dialect: "sqlite", storage: databasePath});

export const Website = sequelize.define<Model<InternalWebsiteAttributes>>("Website", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    url: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        unique: true,
        validate: {
            isUrl: true,
        }
    },
    title: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT("tiny")
    },
    faviconPicture: {
        type: DataTypes.TEXT("tiny"),
        validate: {
            isUrl: true
        },
        get(): Nullable<WebsitePicture> {
            if (!this.getDataValue("faviconPicture")) {
                return null
            }
            return getWebsitePicture("favicon", this.getDataValue("faviconPicture") as string, this.getDataValue("id"))
        }
    },
    previewPicture: {
        type: DataTypes.TEXT("tiny"),
        validate: {
            isUrl: true
        },
        get(): Nullable<WebsitePicture> {
            if (!this.getDataValue("previewPicture")) {
                return null
            }
            return getWebsitePicture("preview", this.getDataValue("previewPicture") as string, this.getDataValue("id"))
        }
    },
    metadata: {
        type: DataTypes.VIRTUAL,
        get(): WebsiteMetadata {
            return {
                description: this.getDataValue("description"),
                title: this.getDataValue("title"),
                pictures: {
                    preview: this.get("previewPicture") as Nullable<WebsitePicture>,
                    favicon: this.get("faviconPicture") as Nullable<WebsitePicture>
                }
            };
        },
    },
    creationDate: DataTypes.DATE,
    modificationDate: DataTypes.DATE
}, {
    timestamps: true,
    createdAt: "creationDate",
    updatedAt: "modificationDate"
}) as unknown as ModelDefined<WebsiteAttributes, WebsiteCreationAttributes>


export const Bookmark = sequelize.define<Model<InternalBookmarkAttributes>>("Bookmark", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    url: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    collection: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: TopCollections.MAIN,
    },
    variant: {
        type: DataTypes.ENUM(...Object.values(BookmarkVariant)),
        allowNull: false,
        defaultValue: BookmarkVariant.PREVIEW,
    },
    tags: {
        type: DataTypes.TEXT,
        get(): Nullable<string[]> {
            const tags = this.getDataValue('tags');
            return tags ? tags.split(ARRAY_SEPARATOR) : [];
        },
        set(tags: Nullable<string[]>) {
            const tagsString = tags ? tags.join(ARRAY_SEPARATOR) : null
            this.setDataValue("tags", tagsString);
        }
    },
    description: {
        type: DataTypes.STRING
    },
    linkTitle: {
        type: DataTypes.STRING
    },
    faviconPath: {
        type: DataTypes.STRING
    },
    previewPath: {
        type: DataTypes.STRING
    },
    siteName: {
        type: DataTypes.STRING
    },
    openHistory: {
        type: DataTypes.TEXT,
        set(dates: Nullable<Date[]>) {
            const datesString = dates ? dates.map(date => date.toUTCString()).join(ARRAY_SEPARATOR) : null
            this.setDataValue("openHistory", datesString);
        },
        get(): Nullable<Date[]> {
            const dates = this.getDataValue('openHistory');
            return dates ? dates.split(ARRAY_SEPARATOR).map((date: string) => new Date(date)) : [];
        }
    },
    copyHistory: {
        type: DataTypes.TEXT,
        set(dates: Nullable<Date[]>) {
            const datesString = dates ? dates.map(date => date.toUTCString()).join(ARRAY_SEPARATOR) : null
            this.setDataValue("copyHistory", datesString);
        },
        get(): Nullable<Date[]> {
            const dates = this.getDataValue('copyHistory');
            return dates ? dates.split(ARRAY_SEPARATOR).map((date: string) => new Date(date)) : [];
        }
    },
    creationDate: DataTypes.DATE,
    modificationDate: DataTypes.DATE
}, {
    timestamps: true,
    createdAt: "creationDate",
    updatedAt: 'modificationDate'
}) as unknown as ModelDefined<BookmarkAttributes, BookmarkCreationAttributes>

export const Collection: ModelDefined<CollectionAttributes, CollectionCreationAttributes> = sequelize.define("Collection", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        parent: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: TopCollections.MAIN,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isFolded: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        iconPath: {
            type: DataTypes.STRING
        },
        index: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        creationDate: DataTypes.DATE,
        modificationDate: DataTypes.DATE
    },
    {
        timestamps: true,
        createdAt: "creationDate",
        updatedAt: 'modificationDate',
    });


(async () => {
    await sequelize.sync({force: true});
})();