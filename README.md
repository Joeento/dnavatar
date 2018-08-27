# Project Title

As of 2017, more than 1 out of every 25 adults have access to their personal genome.  This is easier than ever with websites like Ancestry.com and 23andMe offering the raw data for your DNA in a text file.  Thanks to the people at genomelink, we can also extract useful data from these genomes.  My goal for the [Genomelink Hackathon 2.0](https://genomelink2.devpost.com/) was to create a way to take that data and hack together a way to render your physical attributes into a cartoon avatar that could be reused in different places, while also getting some hands on React expirience along the way.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

First, you will need to create an app in genomelink.io.  You can learn more about that [here](https://genomelink.io/developers/docs/tutorial-oauth-example/).  Once you have the credentials, export them as enviornment variables to your system.

```
$ export GENOMELINK_CLIENT_ID=your_client_id
$ export GENOMELINK_CLIENT_SECRET=your_client_secret
$ export GENOMELINK_CALLBACK_URL="http://127.0.0.1:3000/callback"
```

Once you have that, it's time to run it.  You'll need `yarn` to do so.  Once you have that, just run
```
yarn
```
to install the dependencies and then 

```
yarn dev
```
to start on local.  You may also need
```
cd client
npm start
```
in order to install react packages.
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be



And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo


```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
