terraform {
  backend "s3" {
    key            = "capra-fagradar/state.tfstate"
    bucket         = "120532771136-terraform-state"
    dynamodb_table = "120532771136-terraform-lock"
    region         = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-west-1"
}

module "radar_website" {
  source = "./../"

  s3_bucket_name = "capra-radar-120532771136"
}
