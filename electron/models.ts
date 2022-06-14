import {DataTypes, Sequelize} from 'sequelize';
import {SpecialFolders} from '../src/helpers/folders';

const sequelize = new Sequelize('sqlite::memory:');

export const Bookmark = sequelize.define('Bookmark', {
    linkTitle: DataTypes.STRING,
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.STRING,
    collection: {
        type: DataTypes.STRING,
        defaultValue: SpecialFolders.WITHOUT_FOLDER,
        allowNull: false
    },
    variant: {
        type: DataTypes.ENUM("icon", "preview"),
        defaultValue: "preview",
        allowNull: false
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    faviconPath: DataTypes.STRING,
    previewPath: DataTypes.STRING,
    siteName: DataTypes.STRING,
    openHistory: DataTypes.ARRAY(DataTypes.DATE),
    copyHistory: DataTypes.ARRAY(DataTypes.DATE),
}, {
    timestamps: true,
    createdAt: "creationDate",
    updatedAt: 'modificationDate'
});

export const Folder = sequelize.define('Folder', {
        key: DataTypes.STRING,
        name: DataTypes.STRING,
        iconPath: DataTypes.STRING,
        children: DataTypes.ARRAY(DataTypes.UUIDV4),
        parent: DataTypes.UUIDV4,
        isFolded: DataTypes.BOOLEAN,
    },
    {
        timestamps: true,
        createdAt: "creationDate",
        updatedAt: 'modificationDate'
    });