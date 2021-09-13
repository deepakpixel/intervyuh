import LoadingSkelton from '../../components/LoadingSkelton';
import InterviewCard from './InterviewCard';

const PastInterviews = ({ interviewsData }) => {
  const pastInterviews = interviewsData?.allInterviews?.interviews?.filter(
    (i) => i.isEnded
  );

  return (
    <section className="mb-4">
      <h2 className="flex items-center my-2">
        <div className="text-blue-500 font-semibold text-2xl mr-4 py-1">
          Past interviews
        </div>
      </h2>{' '}
      {!interviewsData.fetchLoading ? (
        pastInterviews?.length ? (
          <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
            {pastInterviews.map((interview) => {
              return (
                <InterviewCard interview={interview} key={interview._id} />
              );
            })}
          </div>
        ) : (
          <h3 className="my-2">
            <div className="text-gray-500 text-xl ">
              No past interviews found
            </div>
            <p>Ended interviews will show here.</p>
          </h3>
        )
      ) : (
        <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
          {/* <InterviewCard /> */}
          <LoadingSkelton />
          <LoadingSkelton />
          <LoadingSkelton />
        </div>
      )}
    </section>
  );
};

export default PastInterviews;
