function setup()
{
  puckSize = 84;
  createCanvas(puckSize * 7, puckSize * 7);
  background("brown");
  noStroke();
  ellipseMode(CORNER);

  grid = [[null, null, null, null, null, null, null], [null, null, null, null, null, null, null], [null, null, null, null, null, null, null], [null, null, null, null, null, null, null], [null, null, null, null, null, null, null], [null, null, null, null, null, null, null]];
  currentColumn = null;
  currentPlayer = "red";
  gameOver = false;

  fill("#fae");
  for (let column = 0; column < grid[0].length; ++column)
  {
    for (let row = 0; row < grid.length; ++row)
    {
      circle(column * puckSize, puckSize + row * puckSize, puckSize);
    }
  }

  tile = createImage(puckSize, puckSize);
  tile.loadPixels();
  for (let x = 0; x < tile.width; ++x)
  {
    for (let y = 0; y < tile.height; ++y)
    {
      if (((x - puckSize / 2) ** 2 + (y - puckSize / 2) ** 2) ** 0.5 > 32)
      {
        tile.set(x, y, [255, 255, 0, 255]);
      }
    }
  }
  tile.updatePixels();
  for (let column = 0; column < grid[0].length; ++column)
  {
    for (let row = 0; row < grid.length; ++row)
    {
      image(tile, column * puckSize, puckSize + row * puckSize);
    }
  }

  // frameRate(1);
  noLoop();
}

function draw()
{
  // if a puck is falling
}

function mouseMoved()
{
  if (!gameOver)
  {
    if (0 <= mouseX && mouseX <= width && floor(mouseX / puckSize) != currentColumn)
    {
      fill("brown");
      square(currentColumn * puckSize, 0, puckSize);

      currentColumn = floor(mouseX / puckSize);

      fill(currentPlayer);
      circle(currentColumn * puckSize, 0, puckSize);
    }
  }
}

function mouseClicked()
{
  if (!gameOver)
  {
    for (let row = grid.length - 1; row >= 0; --row)
    {
      if (grid[row][currentColumn] == null)
      {
        grid[row][currentColumn] = currentPlayer;
        fill(currentPlayer)
        circle(currentColumn * puckSize, puckSize + row * puckSize, puckSize);
        image(tile, currentColumn * puckSize, puckSize + row * puckSize);

        gameOver = gameWon(row, currentColumn);
        if (gameOver)
        {
          fill("brown");
          rect(0, 0, width, puckSize);
          fill("purple")
          textSize(100);
          textAlign(CENTER);
          text(currentPlayer + " wins", width / 2, height / 2);
          return;
        }

        if (currentPlayer == "red")
          currentPlayer = "black";
        else
          currentPlayer = "red";

        fill(currentPlayer);
        circle(currentColumn * puckSize, 0, puckSize);

        return;
      }
    }
  }
}

function gameWon(row, column)
{
  let connected;
  let offset;

  // print(row, column);

  // Check for a horizontal victory
  connected = 1;

  offset = -1;
  while (column + offset >= 0 && grid[row][column + offset] == currentPlayer)
  {
    ++connected;
    --offset;
  }

  offset = 1;
  while (column + offset < grid[row].length && grid[row][column + offset] == currentPlayer)
  {
    ++connected;
    ++offset;
  }

  // print("—:", currentPlayer, connected);

  if (connected >= 4)
    return true;

  // Check for a vertical victory
  connected = 1;

  offset = -1;
  while (row + offset >= 0 && grid[row + offset][column] == currentPlayer)
  {
    ++connected;
    --offset;
  }

  offset = 1;
  while (row + offset < grid.length && grid[row + offset][column] == currentPlayer)
  {
    ++connected;
    ++offset;
  }

  // print("|:", currentPlayer, connected);

  if (connected >= 4)
    return true;

  // Check for a forward diagonal victory
  connected = 1;

  offset = -1;
  while (row - offset < grid.length && column + offset >= 0 && grid[row - offset][column + offset] == currentPlayer)
  {
    ++connected;
    --offset;
  }

  offset = 1;
  while (row - offset >= 0 && column + offset < grid[row].length && grid[row - offset][column + offset] == currentPlayer)
  {
    ++connected;
    ++offset;
  }

  // print("/:", currentPlayer, connected);

  if (connected >= 4)
    return true;

  // Check for a backward diagonal victory
  connected = 1;

  offset = -1;
  while (row + offset >= 0 && column + offset >= 0 && grid[row + offset][column + offset] == currentPlayer)
  {
    ++connected;
    --offset;
  }

  offset = 1;
  while (row + offset < grid.length && column + offset < grid[row].length && grid[row + offset][column + offset] == currentPlayer)
  {
    ++connected;
    ++offset;
  }

  // print("\\:", currentPlayer, connected);

  if (connected >= 4)
    return true;

  return false;
}
