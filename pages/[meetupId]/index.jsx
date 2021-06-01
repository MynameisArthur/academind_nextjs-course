import MeetupDetail from '../../components/meetups/MeetupDetail';
import {MongoClient, ObjectId} from 'mongodb';
import Head from 'next/head';
function MeetupDetails(props) {
    const {image, title, address, description} = props.meetupData;
    return (
        <>
            <Head>
                <title>Meetups | {title}</title>
                <meta name='description' content={description} />
            </Head>
            <MeetupDetail
                image={image}
                title={title}
                address={address}
                description={description}
            />
        </>
    );
}
export async function getStaticPaths() {
    const client = await MongoClient.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@devconnector.g6cz2.mongodb.net/meetups?retryWrites=true&w=majority`
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection
        .find(
            {},
            {
                _id: 1,
            }
        )
        .toArray();
    client.close();
    return {
        paths: meetups.map((meetup) => ({
            params: {meetupId: meetup._id.toString()},
        })),
        fallback: 'blocking',
    };
}
export async function getStaticProps(context) {
    const {meetupId} = context.params;
    const client = await MongoClient.connect(
        'mongodb+srv://arthur_800:pass1234@devconnector.g6cz2.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({
        _id: ObjectId(meetupId),
    });
    client.close();
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description,
                image: selectedMeetup.image,
            },
        },
    };
}

export default MeetupDetails;
