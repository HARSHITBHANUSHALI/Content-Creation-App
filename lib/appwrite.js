import { Avatars, Client, Databases, Query, Storage } from 'react-native-appwrite';
import { Account } from 'react-native-appwrite';
import { ID } from 'react-native-appwrite';
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.reactnative.myapp',
    projectId:'6734e33500282f0713f1',
    databaseId: '6734e51e0023ed111115',
    userCollectionId: '6734e54300036d51f066',
    videoCollectionId: '6734e56a002c5e31fed5',
    storageId: '6734e7230006dce373ca'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
export async function createUser (email,password,username){
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email,password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }
}

export async function signIn(email, password){
    try {
        console.log("Attempting to sign in with:", { email, password });
        const session = await account.createEmailPasswordSession(email, password);
        console.log("Sign-in successful:", session);
        return session; // Return session if needed
    } catch (error) {
        console.error("Sign-in error details:", error); // Capture full error details
        if (error.code === 401) {
            console.error("Invalid email or password.");
        }
        throw new Error("Sign-in failed. Please check your credentials or try again later.");
    }
}


export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getAllPosts = async ()=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async ()=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query)=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title',query)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId)=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('users',userId)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const signout = async () =>{
    try {
        const session = account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId,type)=>{
    let fileUrl;

    try {
        if(type ==='video'){
            fileUrl = storage.getFileView(config.storageId, fileId)
        }else if(type==='image'){
            fileUrl = storage.getFilePreview(config.storageId,fileId,2000,2000,'top',100)
        }else{
            throw new Error('Invalid file type');
        }

        // console.log("Fileurl",fileUrl);

        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file,type) =>{
    if(!file) return;

    const {mimeType,...rest} = file;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }
    // console.log("Assest",asset);

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );

        // console.log("UploadedFile",uploadedFile)

        const fileUrl = await getFilePreview(uploadedFile.$id,type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form)=>{
    try {
        // console.log("Form values",form.thumbnail,form.video);
        const [thumbnailUrl,videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])
        const newPost = await databases.createDocument(
            config.databaseId, config.videoCollectionId,ID.unique(),{
                title: form.title,
                thumbnail:thumbnailUrl,
                video:videoUrl,
                prompt:form.prompt,
                users: form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}