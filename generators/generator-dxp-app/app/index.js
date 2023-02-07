// @ts-check
const fs = require("fs-extra")
const path = require("path")
const { default: slugify } = require("slugify")
const Generator = require("yeoman-generator")

module.exports = class extends Generator {
  initializing() {
    this.log("Generating your monorepo")
    this.props = {}
    this.pkgs = {
      defaultPkgs: [
        // Currently just copying over the template package.json, but this can be configured to add packages initially
      ],
    }
  }

  async prompting() {
    const props = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "What is your application's name?",
      },
      {
        type: "input",
        name: "description",
        message: "Please enter a description for your project: ",
      },
      {
        type: "list",
        name: "framework",
        choices: ["nextJS"],
        message: "Which framework would you like to use?",
      },
      {
        type: "input",
        name: "repo",
        message: "Please enter the URL for the GitHub repository: ",
      },
    ])
    if (this.props) {
      this.props.name = slugify(props.name)
      this.props.framework = props.framework
      this.props.description = props.description
      this.props.repo = props.repo
    }
  }

  async configuration() {
    this.log("Building file structure...")
    try {
      await fs.copy(
        `${this.sourceRoot()}/monorepo/apps`,
        `${this.destinationPath(`../${this.props?.name}/apps`)}`,
      )
      await fs.copy(
        `${this.sourceRoot()}/monorepo/services`,
        `${this.destinationPath(`../${this.props?.name}/services`)}`,
      )
      await fs.copy(
        `${this.sourceRoot()}/monorepo/dxp.config.js`,
        `${this.destinationPath(`../${this.props?.name}/dxp.config.js`)}`,
      )
      await this.fs.copyTpl(
        `${this.sourceRoot()}/monorepo/package.json`,
        `${this.destinationPath(`../${this.props?.name}/package.json`)}`,
        {
          appName: this.props?.name,
          description: this.props?.description,
        },
      )
    } catch (e) {
      this.log("Something went wrong! ", e)
    }
  }

  async writing() {
    this.log(`Writing files to ${this.destinationPath(`../${this.props?.name}`)}`)

    this.log("Finished writing files!")
  }

  end() {
    this.log(
      `Your new monorepo is located at -----> ${this.destinationPath(`../${this.props?.name}`)}`,
    )
  }
}
