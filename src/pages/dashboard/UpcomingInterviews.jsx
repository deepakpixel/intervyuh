import LoadingCard from '../../components/LoadingCard';
import InterviewCard from './InterviewCard';

const UpcomingInterviews = ({ setShowCreateInterview, interviewsData }) => {
  const upcomingInterviews = interviewsData?.allInterviews?.interviews?.filter(
    (i) => !i.isEnded
  );
  return (
    <section className="mb-4">
      <h2 className="flex items-center my-2">
        <div className="text-blue-500 font-semibold text-2xl mr-4 py-1">
          Upcoming interviews
        </div>
        <div
          className="inline-block rounded-full text-white bg-blue-500 hover:bg-blue-700 duration-300 font-bold cursor-pointer px-4 py-1"
          onClick={() => {
            setShowCreateInterview(true);
          }}
        >
          + New
        </div>
      </h2>
      {upcomingInterviews ? (
        upcomingInterviews.length ? (
          <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
            {upcomingInterviews.map((interview) => {
              return (
                <InterviewCard interview={interview} key={interview._id} />
              );
            })}
          </div>
        ) : (
          <h3 className="my-2">
            <div className="text-gray-500 text-xl ">
              No upcoming interviews found
            </div>
            <p>
              <span
                className="text-blue-700 underline cursor-pointer"
                onClick={() => {
                  setShowCreateInterview(true);
                }}
              >
                Click here{' '}
              </span>{' '}
              to create an interview
            </p>
          </h3>
        )
      ) : (
        <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
          {/* <InterviewCard /> */}
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      )}
    </section>
  );
};

export default UpcomingInterviews;
